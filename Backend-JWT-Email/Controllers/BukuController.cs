using Microsoft.AspNetCore.Mvc;

using Backend_JWT_Email.Models.DTOs;
using Backend_JWT_Email.Services;
using System.Security;

namespace Backend_JWT_Email.Controllers;

[ApiController]
[Route("api/[controller]")]
[Microsoft.AspNetCore.Authorization.Authorize]
public class BukuController(IBukuService srv) : ControllerBase
{
    private readonly IBukuService service  = srv;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var data = await service.GetAllAsync();
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var data = await service.GetByIdAsync(id);
        if (data == null) return NotFound( $"Buku id {id} tidak ditemukan.");
		return Ok(data);
    }
	
    [HttpGet("view/{id}")]
    public async Task<IActionResult> GetViewAsync(int id)
    {
        var data = await service.GetViewAsync(id);
        if (data == null) return NotFound( $"View Buku id {id} tidak ditemukan.");
		return Ok(data);
    }
	
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TBukuBase dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TBukuUpdate dto)
    {
        var success = await service.UpdateAsync(id, dto);
        if (!success) return NotFound( $"Buku {id} tidak ditemukan." );
        return Ok(success);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await service.DeleteAsync(id);
        if (!success) return NotFound("Buku tidak ditemukan.");
        return Ok(success);//NoContent();
    }
}
